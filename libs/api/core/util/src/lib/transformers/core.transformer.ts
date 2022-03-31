export abstract class CoreTransformer<Entity, Response> {
  abstract transform(entity: Entity): Response;
}
