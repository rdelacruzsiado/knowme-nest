import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, name, password, port } = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: name,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
