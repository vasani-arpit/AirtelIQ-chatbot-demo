/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


class NormalRouterServer extends Server {

    private readonly FRONT_END_MSG = 'OvernightJS with standard express router started.';
    private readonly START_MSG = 'OvernightJS with standard express router started on port: ';


    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.setupControllers();
    }


    private setupControllers(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === 'function') {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }


    public start(port?: number): void {
        port = port || 3000;
        this.app.get('*', (req: Request, res: Response) => {
            res.send(this.FRONT_END_MSG);
        });
        this.app.listen(port, () => {
            Logger.Imp(this.START_MSG + port);
        });
    }
}

const server = new NormalRouterServer();
server.start(4000);

