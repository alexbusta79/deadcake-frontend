import {IEnvironment, IEnvironmentParams} from "./ienvironments";

const params: IEnvironmentParams = {
    production: true
};

export const environment: IEnvironment = new IEnvironment(params);