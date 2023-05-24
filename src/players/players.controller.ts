import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playersService.createUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player | Player[]> {
    if (email) return this.playersService.findPlayerByEmail(email);
    return this.playersService.findAllPlayers();
  }

  @Delete()
  async removePlayer(@Body('email') email: string): Promise<void> {
    await this.playersService.removePlayerByEmail(email);
  }
}
