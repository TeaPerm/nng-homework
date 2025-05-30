import { logger } from "./logger.js";
import { imageService } from "./apis/imageService.js";
import { mathService } from "./apis/mathService.js";
import { userService } from "./apis/userService.js";

const serviceRegistry = {
  imageService: imageService,
  mathService: mathService,
  userService: userService,
};

export async function dispatch(request) {
  try {
    const { service, method, params } = request;
    logger.info(`Received request for service: ${service}, method: ${method}`);

    if (!serviceRegistry[service]) {
      logger.error(`Service ${service} not found`);
      return {
        status: 404,
        message: `Service ${service} not found`,
      };
    }

    const serviceModule = serviceRegistry[service];

    if (typeof serviceModule[method] !== "function") {
      logger.error(`Method ${method} not found in service ${service}`);
      return {
        status: 404,
        message: `Method ${method} not found in service ${service}`,
      };
    }

   const result = await serviceModule[method](...(params || []));

    logger.info(
      `Successfully processed request for service: ${service}, method: ${method}`
    );

    return {
      status: 200,
      service: service,
      method: method,
      params: params || [],
      message: "Request processed successfully",
      result: result,
    };
  } catch (error) {
    logger.error(`Error processing request: ${error.message}`);
    return {
      status: 500,
      message: error.message,
    };
  }
}


export function listServices() {
  const services = {};

  for (const [serviceName, serviceModule] of Object.entries(serviceRegistry)) {
    const serviceMethods = {};

    for (const [methodName, methodFn] of Object.entries(serviceModule)) {
      if (typeof methodFn === "function" && methodName !== "meta") {
        const metaInfo = serviceModule.meta?.[methodName]?.params || [];

        serviceMethods[methodName] = {
          params: metaInfo.map((param) => ({
            name: param.name || "",
            type: param.type || "any",
          }))
        };
      }
    }

    services[serviceName] = serviceMethods;
  }

  return {
    status: 200,
    message: "Available services and methods",
    services
  };
}
