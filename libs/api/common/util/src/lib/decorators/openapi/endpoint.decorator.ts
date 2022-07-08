import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeaderOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
} from '@nestjs/swagger';
import { Class } from '@trackyourhealth/api/core/util';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import deepmerge = require('deepmerge');
import { PartialDeep } from 'type-fest';

export interface EndpointConfiguration {
  meta: ApiOperationOptions;
  authentication: {
    required: boolean;
  };
  request: {
    mime: string[];
    headers: ApiHeaderOptions[];
    params: ApiParamOptions[];
    queries: ApiQueryOptions[];
    addPaginationQueryParams: boolean;
    addSelectQueryParams: boolean;
    addSortQueryParams: boolean;
  };
  response: {
    status: HttpStatus;
    mime: string[];
    paginated: boolean;
  };
  excludeFromDocs: boolean;
}

const defaultConfiguration: EndpointConfiguration = {
  meta: {},
  authentication: {
    required: true,
  },
  request: {
    mime: ['application/json'],
    headers: [],
    params: [],
    queries: [],
    addPaginationQueryParams: false,
    addSelectQueryParams: false,
    addSortQueryParams: false,
  },
  response: {
    status: HttpStatus.OK,
    mime: ['application/json'],
    paginated: false,
  },
  excludeFromDocs: false,
};

let decoratorsToApply: (
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator
)[] = [];

let extraModels: Class<any>[] = [];

export const Endpoint = (options: PartialDeep<EndpointConfiguration>) => {
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

  // addApiRequest(config);
  // // addApiResponse(config);

  // addApiExtraModels();

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

/*

function addApiRequest(config: OpenApiEndpointConfiguration) {
  if (config.request.mime) {
    const apiConsumes = ApiConsumes(...config.request.mime);
    decoratorsToApply.push(apiConsumes);
  }

  if (config.request.params) {
    config.request.params.forEach((param) => {
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

  if (config.request.queries) {
    config.request.queries.forEach((query) => {
      const apiQuery = ApiQuery(query);
      decoratorsToApply.push(apiQuery);
    });
  }

  if (config.request.addPaginationQueries) {
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

  if (config.request.addSortQueries) {
    const sortQuery = ApiQuery({
      name: 'sort',
      description:
        'Sort Result by specific fields. Comma separated list. Use "-" to sort DESC',
      example: 'id,-name',
      type: 'string',
    });
    decoratorsToApply.push(sortQuery);
  }

  if (config.request.addSelectQueries) {
    const fieldQuery = ApiQuery({
      name: 'select',
      description: 'Select only specific fields from the API',
      example: 'id,name,description',
      type: 'string',
    });
    decoratorsToApply.push(fieldQuery);
  }

  if (config.request.model) {
    const baseRequestType = CreateDataRequest(config.request.model);

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
}

function addApiResponse(config: OpenApiEndpointConfiguration) {
  if (config.response.mime) {
    const apiProduces = ApiProduces(...config.response.mime);
    decoratorsToApply.push(apiProduces);
  }

  if (config.response.transformer) {
    const apiTransformer = ApiTransformer(config.response.transformer);
    decoratorsToApply.push(apiTransformer);
  }

  if (config.response.model) {
    let baseResponseType = CreateDataResponse(config.response.model);
    if (config.response.paginated) {
      baseResponseType = CreatePaginatedDataResponse(config.response.model);
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
*/
