import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExcludeEndpoint,
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
} from '@nestjs/swagger';
import { ApiAuthGuard, ApiRolesGuard } from '@trackyourhealth/api/auth/util';
import * as deepmerge from 'deepmerge';
import { PartialDeep } from 'type-fest';

import { Roles } from '../../enums/roles.enum';
import { ApiRoles } from '../api-roles.decorator';

export interface OpenApiEndpointConfiguration {
  meta: ApiOperationOptions;
  tags: string[];
  authentication: {
    required: boolean;
    roles: Roles[];
  };
  request: {
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
    mime: string[];
    paginated: boolean;
  };
  exclude: boolean;
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
  tags: [],
  request: {
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
    mime: ['application/json'],
    paginated: false,
  },
  exclude: false,
};

const decoratorsToApply: (
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator
)[] = [];

export const OpenApiEndpoint = (
  options: PartialDeep<OpenApiEndpointConfiguration>,
) => {
  // const config = deepmerge(defaultConfiguration, options);
  /*
  const config: OpenApiEndpointConfiguration = {
    ...defaultConfiguration,
    ...options,
  };

  // clear the decorators that should be applied before
  decoratorsToApply = [];

  addApiBasic(config);
  addApiOperation(config);

  addApiSecurity(config);

  addApiRequest(config);
  addApiResponse(config);

  return applyDecorators(...decoratorsToApply);
  */
};

function addApiBasic(config: OpenApiEndpointConfiguration) {
  const httpCode = HttpCode(config.response.status);
  decoratorsToApply.push(httpCode);

  if (config.tags) {
    const apiTags = ApiTags(...config.tags);
    decoratorsToApply.push(apiTags);
  }

  if (config.exclude === true) {
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
}

function addApiResponse(config: OpenApiEndpointConfiguration) {
  if (config.response.mime) {
    const apiProduces = ApiProduces(...config.response.mime);
    decoratorsToApply.push(apiProduces);
  }

  const apiResponse = ApiResponse({
    status: config.response.status,
    description: 'The default Response',
  });
  decoratorsToApply.push(apiResponse);
}
