import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './provider/app.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'client/dist'),
    }),
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
