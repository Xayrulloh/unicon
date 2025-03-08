import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

class SwaggerBuilder {
  static make(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Unicon Task')
      .setDescription(
        'Here you can see all the endpoints with request/response examples',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    return SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        docExpansion: 'none',
        persistAuthorization: true,
      },
    });
  }
}

export default SwaggerBuilder;
