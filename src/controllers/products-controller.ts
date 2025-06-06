import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import {z} from 'zod'
import { knex } from "@/database/knex";

class ProductsController {
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const {name} = request.query

            const products = await knex<ProductRepository>('products')
                .select()
                .whereLike('name', `%${name ?? ""}%`)
                .orderBy('name')

            return response.json(products)
        } catch (error) {
            next(error)
        }
    }

    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(6),
                price: z.number().gt(0, {message: 'O preço deve ser maior que 0'}),
            })

            const { name, price } = bodySchema.parse(request.body)

            await knex<ProductRepository>('products').insert({
                name,
                price
            })

            return response.status(201).json()
          
        } catch (error) {
            next(error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {

            const id = z
                .string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), {message: "ID inválido"})
                .parse(request.params.id)

            const bodySchema = z.object({
                name: z.string().trim().min(6),
                price: z.number().gt(0),
            })

            const { name, price } = bodySchema.parse(request.body)

            const product = await knex<ProductRepository>('products')
                .select()
                .where({id})
                .first()

            if(!product) {
                throw new AppError('Produto não encontrado')
            }

            await knex<ProductRepository>('products').update({
                name,
                price,
                update_at: knex.fn.now()
            }).where({id})

            return response.json()

        } catch (error) {
            next(error)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = z
                .string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), {message: "ID inválido"})
                .parse(request.params.id)

            const product = await knex<ProductRepository>('products')
                .where({id})
                .first()

            if(!product) {
                throw new AppError('Produto não encontrado')
            }

            await knex<ProductRepository>('products').delete().where({id})  

            return response.json()
        } catch (error) {
            next(error)
        }
    }
}

export { ProductsController }