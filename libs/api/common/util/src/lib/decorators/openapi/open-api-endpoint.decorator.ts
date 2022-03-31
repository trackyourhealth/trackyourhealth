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
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiAuthGuard, ApiRolesGuard } from '@trackyourhealth/api/auth/util';
import {
  Class,
  CoreTransformer,
  // CreateDataRequest,
  CreateDataResponse,
  CreatePaginatedDataResponse,
  // DataOutput,
} from '@trackyourhealth/api/core/util';
import * as deepmerge from 'deepmerge';
import { PartialDeep } from 'type-fest';

import { Roles } from '../../enums/roles.enum';
import { ApiRoles } from '../api-roles.decorator';
import { ApiTransformer } from '../api-transformer.decorator';

export interface OpenApiEndpointConfiguration {
  meta: ApiOperationOptions;
  authentication: {
    required: boolean;
    roles: Roles[];
  };
  request: {
    model: Class | undefined;
    mime: string[];
    headers: ApiHeaderOptions[];
    params: ApiParamOptions[];
    queries: ApiQueryOptions[];
    addPaginationQueries: boolean;
    addSelectQueries: boolean;
    addSortQueries: boolean;
  };
  response: {
    status: HttpStatus;
    model: Class | undefined;
    mime: string[];
    paginated: boolean;
    transformer: Class<CoreTransformer<unknown, unknown>> | undefined;
  };
  excludeFromDocs: boolean;
}

const defaultConfiguration: OpenApiEndpointConfiguration = {
  meta: {
    summary: undefined,
    description: undefined,
  },
  authentication: {
    required: true,
    roles: [],
  },
  request: {
    model: undefined,
    mime: ['application/json'],
    headers: [],
    params: [],
    queries: [],
    addPaginationQueries: false,
    addSelectQueries: false,
    addSortQueries: false,
  },
  response: {
    status: HttpStatus.OK,
    model: undefined,
    mime: ['application/json'],
    paginated: false,
    transformer: undefined,
  },
  excludeFromDocs: false,
};

let decoratorsToApply: (
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator
)[] = [];

let extraModels: Class<any>[] = [];

export const OpenApiEndpoint = (
  options: PartialDeep<OpenApiEndpointConfiguration>,
) => {
  const config = deepmerge(
    defaultConfiguration,
    options,
  ) as OpenApiEndpointConfiguration;

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

function addApiBasic(config: OpenApiEndpointConfiguration) {
  const httpCode = HttpCode(config.response.status);
  decoratorsToApply.push(httpCode);

  if (config.excludeFromDocs === true) {
    const apiExcludeEndpoint = ApiExcludeEndpoint(true);
    decoratorsToApply.push(apiExcludeEndpoint);
  }
}

function addApiOperation(config: OpenApiEndpointConfiguration) {
  const apiOperation = ApiOperation(config.meta);
  decoratorsToApply.push(apiOperation);
}

function addApiSecurity(config: OpenApiEndpointConfiguration) {
  if (config.authentication.required) {
    const apiBearerAuth = ApiBearerAuth();
    decoratorsToApply.push(apiBearerAuth);

    const apiAuthGuard = UseGuards(ApiAuthGuard);
    decoratorsToApply.push(apiAuthGuard);

    if (config.authentication.roles) {
      const apiRoles = ApiRoles(...config.authentication.roles);
      decoratorsToApply.push(apiRoles);

      const apiRolesGuard = UseGuards(ApiRolesGuard);
      decoratorsToApply.push(apiRolesGuard);
    }
  }
}

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

  /* if (config.request.model) {
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
  } */
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

function addApiExtraModels() {
  const apiExtraModels = ApiExtraModels(...extraModels);
  decoratorsToApply.push(apiExtraModels);
}
