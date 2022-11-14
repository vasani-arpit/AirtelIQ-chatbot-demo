/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';


@Controller('webhook')
export class webhookController {

    @Get('')
    private getAll(req: Request, res: Response) {
        Logger.Info(req.body, true);
        return res.status(OK).json({
            message: 'get_all_called',
        });
    }


    @Post()
    private add(req: Request, res: Response) {
        Logger.Info(req.body, true);
        return res.status(OK).json({
            message: 'add_called',
        });
    }

}