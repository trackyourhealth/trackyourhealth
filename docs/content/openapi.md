# Open API Documentation

`TrackYourHealth` provides a convenient `@Endpoint()` decorator that can be
added to a method within the controller. This decorator, in turn, accepts an
`EndpointConfiguration` object.

Internally, the `@Endpoint` decorator calls the official `OpenApi` decorators
provided by nestjs. In this case, it serves as some kind of `Meta-Decorator`.
