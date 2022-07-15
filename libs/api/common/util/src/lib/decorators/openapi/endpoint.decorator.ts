import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiHeader,
  ApiHeaderOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiProduces,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  Class,
  DataArrayOutput,
  DataOutput,
  GenerateDataRequest,
  GenerateDataResponse,
  GeneratePaginatedDataResponse,
  PaginatedDataOutput,
} from '@trackyourhealth/api/core/util';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import deepmerge = require('deepmerge');
import { PartialDeep } from 'type-fest';

export interface EndpointConfiguration {
  meta: ApiOperationOptions;
  authentication: {
    required: boolean;
  };
  request: {
    mimeTypes: string[];
    headers: ApiHeaderOptions[];
    pathParams: ApiParamOptions[];
    queryParams: ApiQueryOptions[];
    addPaginationQueryParams: boolean;
    // addSelectQueryParams: boolean;
    addSortQueryParams: boolean;
    model?: Class;
    throttleRequest: boolean;
  };
  response: {
    status: HttpStatus;
    mimeTypes: string[];
    paginated: boolean;
    model?: Class;
  };
  excludeFromDocs: boolean;
}

const defaultConfiguration: EndpointConfiguration = {
  meta: {},
  authentication: {
    required: true,
  },
  request: {
    mimeTypes: ['application/json'],
    headers: [],
    pathParams: [],
    queryParams: [],
    addPaginationQueryParams: false,
    addSortQueryParams: false,
    model: undefined,
    throttleRequest: true,
  },
  response: {
    status: HttpStatus.OK,
    mimeTypes: ['application/json'],
    paginated: false,
    model: undefined,
  },
  excludeFromDocs: false,
};

let decoratorsToApply: (
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator
)[] = [];

let extraModels: Class<any>[] = [];

export const Endpoint = (options: PartialDeep<EndpointConfiguration> = {}) => {
  const config = deepmerge(
    defaultConfiguration,
    options,
  ) as EndpointConfiguration;

  // clear the decorators that should be applied before
  decoratorsToApply = [];
  extraModels = [];

  addApiBasic(config);
  addApiOperation(config);

  addApiSecurity(config);

  addApiRequest(config);
  addApiResponse(config);

  addApiExtraModels();

  return applyDecorators(...decoratorsToApply);
};

function addApiBasic(config: EndpointConfiguration) {
  const httpCode = HttpCode(config.response.status);
  decoratorsToApply.push(httpCode);

  if (config.excludeFromDocs === true) {
    const apiExcludeEndpoint = ApiExcludeEndpoint(true);
    decoratorsToApply.push(apiExcludeEndpoint);
  }
}

function addApiOperation(config: EndpointConfiguration) {
  const apiOperation = ApiOperation(config.meta);
  decoratorsToApply.push(apiOperation);
}

function addApiSecurity(config: EndpointConfiguration) {
  if (config.authentication.required) {
    const apiBearerAuth = ApiBearerAuth('kratos');
    decoratorsToApply.push(apiBearerAuth);

    const kratosGuard = UseGuards(KratosGuard);
    decoratorsToApply.push(kratosGuard);

    // TODO: fix this
    // if (config.authentication.roles) {
    //   const apiRoles = ApiRoles(...config.authentication.roles);
    //   decoratorsToApply.push(apiRoles);
    //   const apiRolesGuard = UseGuards(ApiRolesGuard);
    //   decoratorsToApply.push(apiRolesGuard);
    // }
  }
}

function addApiRequest(config: EndpointConfiguration) {
  if (config.request.mimeTypes) {
    const apiConsumes = ApiConsumes(...config.request.mimeTypes);
    decoratorsToApply.push(apiConsumes);
  }

  if (config.request.pathParams) {
    config.request.pathParams.forEach((param) => {
      const apiParam = ApiParam(param);
      decoratorsToApply.push(apiParam);
    });
  }

  if (config.request.headers) {
    config.request.headers.forEach((header) => {
      const apiHeader = ApiHeader(header);
      decoratorsToApply.push(apiHeader);
    });
  }

  if (config.request.queryParams) {
    config.request.queryParams.forEach((query) => {
      const apiQuery = ApiQuery(query);
      decoratorsToApply.push(apiQuery);
    });
  }

  if (config.request.addPaginationQueryParams) {
    const limitQuery = ApiQuery({
      name: 'limit',
      description: 'Items per Page',
      example: 20,
      type: 'number',
    });
    decoratorsToApply.push(limitQuery);

    const pageQuery = ApiQuery({
      name: 'page',
      description: 'Requested Page',
      example: 10,
      type: 'number',
    });
    decoratorsToApply.push(pageQuery);
  }

  if (config.request.addSortQueryParams) {
    const sortQuery = ApiQuery({
      name: 'sort',
      description:
        'Sort Result by specific fields. Comma separated list. Use "-" to sort DESC',
      example: 'id,-name',
      type: 'string',
    });
    decoratorsToApply.push(sortQuery);
  }

  /*
  if (config.request.addSelectQueryParams) {
    const fieldQuery = ApiQuery({
      name: 'select',
      description: 'Select only specific fields from the API',
      example: 'id,name,description',
      type: 'string',
    });
    decoratorsToApply.push(fieldQuery);
  }
  */

  if (config.request.model) {
    const baseRequestType = GenerateDataRequest(config.request.model);

    const apiBody = ApiBody({
      description: 'Data Input',
      schema: {
        allOf: [
          { $ref: getSchemaPath(baseRequestType) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(config.request.model),
              },
            },
          },
        ],
      },
    });
    decoratorsToApply.push(apiBody);

    extraModels.push(baseRequestType, config.request.model);
  }

  if (config.request.throttleRequest) {
    const throttlerGuard = UseGuards(ThrottlerGuard);
    decoratorsToApply.push(throttlerGuard);
  }
}

function addApiResponse(config: EndpointConfiguration) {
  if (config.response.mimeTypes) {
    const apiProduces = ApiProduces(...config.response.mimeTypes);
    decoratorsToApply.push(apiProduces);
  }

  /*
  if (config.response.transformer) {
    const apiTransformer = ApiTransformer(config.response.transformer);
    decoratorsToApply.push(apiTransformer);
  }
  */

  if (config.response.model) {
    let baseResponseType: Class<
      DataOutput<never> | DataArrayOutput<never> | PaginatedDataOutput<never>
    >;

    baseResponseType = GenerateDataResponse(config.response.model);
    if (config.response.paginated) {
      baseResponseType = GeneratePaginatedDataResponse(config.response.model);
    }

    const apiResponse = ApiResponse({
      status: config.response.status,
      description: 'The default Response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(baseResponseType) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(config.response.model),
              },
            },
          },
        ],
      },
    });

    decoratorsToApply.push(apiResponse);
    extraModels.push(baseResponseType, config.response.model);
  } else {
    const apiResponse = ApiResponse({
      status: config.response.status,
      description: 'The default Response',
    });

    decoratorsToApply.push(apiResponse);
  }
}

function addApiExtraModels() {
  const apiExtraModels = ApiExtraModels(...extraModels);
  decoratorsToApply.push(apiExtraModels);
}
