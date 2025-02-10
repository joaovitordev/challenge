import { HttpStatus, Module } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ContentModule } from './content'
import { UserModule } from './user'
import { CompanyModule } from './company'
import { ApolloDriver } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    // FALHA CRITICA, VALORES DEVERIAM ESTAR NO .ENV
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'challenge',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      formatError: (error: GraphQLError) => {
        return {
          message: error.extensions?.originalError?.['message'],
          status_code:
            Number(error.extensions?.originalError?.['statusCode']) ||
            Number(error?.extensions?.code) ||
            HttpStatus.BAD_REQUEST,
          details: error?.extensions?.exception?.['details'] || error.extensions?.details,
        }
      },
    }),
    ContentModule,
    UserModule,
    CompanyModule,
  ],
})
export class AppModule { }
