import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboardcontroller';
import { UserController } from './controllers/user.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [DashboardController,UserController],
  imports: [SharedModule]
})
export class AdminModule {}
