import {IEnvironment, IEnvironmentParams} from "./ienvironments";

const params: IEnvironmentParams = {
    production: false
};

export const environment: IEnvironment = new IEnvironment(params);