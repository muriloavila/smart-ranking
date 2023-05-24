import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersParametersValidationPipe } from './pipes/players-parameters-validation.pipe';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', PlayersParametersValidationPipe) _id: string,
    @Body() updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDTO);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playersService.findAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', PlayersParametersValidationPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.findPlayerBy({ _id });
  }

  @Delete('/:_id')
  async removePlayer(
    @Param('_id', PlayersParametersValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.removePlayerById(_id);
  }
}
