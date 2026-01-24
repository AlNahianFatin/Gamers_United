import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError) // only catch MulterError
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Upload failed';
    let field = 'file'; // default field

    // Customize messages based on MulterError code
    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size exceeded. Maximum allowed size is 10MB.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = `Invalid file type. Only allowed for field '${exception.field || 'file'}'`;
        field = exception.field || 'file'; // ✅ fallback if undefined
        break;
      default:
        message = exception.message;
    }

    return response.status(400).json({ message: [{ field, messages: [message] }] });
  }
}