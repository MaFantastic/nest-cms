// 导入 ExceptionFilter、Catch 装饰器、ArgumentsHost、HttpException 和 BadRequestException 模块
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
// 导入 express 的 Response 对象，用于构建 HTTP 响应
import { Response } from 'express';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
// 使用 @Catch 装饰器捕获所有 HttpException 异常
@Catch(HttpException)
@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取当前 HTTP 请求上下文
    const ctx = host.switchToHttp();
    // 获取 HTTP 响应对象
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    // 获取异常的 HTTP 状态码
    const status = exception.getStatus();
    // 初始化错误信息，默认为异常的消息
    let errorMessage = exception.message;
    // 如果异常是 BadRequestException 类型，进一步处理错误信息
    if (exception instanceof BadRequestException) {
      // 获取异常的响应体
      const responseBody: any = exception.getResponse();
      // 检查响应体是否是对象并且包含 message 属性
      if (typeof responseBody === 'object' && responseBody.message) {
        // 如果 message 是数组，则将其拼接成字符串，否则直接使用 message
        errorMessage = Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : responseBody.message;
      }
    } else if (exception instanceof I18nValidationException) {
      errorMessage = exception.errors
        .map((error) => {
          return this.formatSingleErrorMessage(
            Object.values(error.constraints).join(', '),
            ctx.getRequest().i18nLang,
          );
        })
        .join(', ');
    }
    if (request.headers['accept'] === 'application/json') {
      response.status(status).json({
        statusCode: status,
        message: errorMessage,
      });
    } else {
      // 使用响应对象构建并发送错误页面，包含错误信息和重定向 URL
      response.status(status).render('error', {
        message: errorMessage,
        redirectUrl: ctx.getRequest().url,
      });
    }
  }
  private formatSingleErrorMessage(message: string, lang: string): string {
    const formattedMessages = message.split(', ').map((msg) => {
      const [key, params] = msg.split('|');
      if (params) {
        try {
          const parsedParams = JSON.parse(params);
          return this.i18n.translate(key, {
            lang,
            args: parsedParams,
          });
        } catch (error) {
          return msg;
        }
      }
      return msg;
    });
    return formattedMessages.join(', ');
  }
}
/**
[
  {
    property: 'username',
    value: 'user_66',
    constraints: { IsUsernameUnique: 'username user_66 已经被使用！' }
  },
  {
    property: 'password',
    value: '',
    constraints: {
      minLength: 'validation.minLength|{"value":"","constraints":[6],"field":"password","length":6}'
    }
  }
]
 */