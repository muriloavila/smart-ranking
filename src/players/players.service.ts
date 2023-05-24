import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;
    const playerFound = await this.players.find(
      (player) => player.email == email,
    );

    if (playerFound) {
      this.update(playerFound, createPlayerDTO);
    } else {
      this.create(createPlayerDTO);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const playerFound = await this.players.find(
      (player) => player.email == email,
    );

    if (!playerFound) {
      throw new NotFoundException('Player Not Found');
    }
    return playerFound;
  }

  async removePlayerByEmail(email: string): Promise<void> {
    const playerFound = await this.players.find(
      (player) => player.email == email,
    );

    if (!playerFound) {
      throw new NotFoundException('Player Not Found');
    }

    this.players = this.players.filter(
      (player: Player) => player.email !== playerFound.email,
    );
  }

  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { email, name, phoneNumber } = createPlayerDTO;

    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      urlPhoto: '',
    };
    this.logger.log(`create player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(playerFound: Player, createPlayerDTO: CreatePlayerDTO): void {
    const { name } = createPlayerDTO;
    playerFound.name = name;
  }
}
