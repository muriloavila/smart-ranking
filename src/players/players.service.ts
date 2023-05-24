import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerFound = await this.playerModel.findOne({ email });

    if (playerFound) {
      this.update(playerFound, createPlayerDTO);
    } else {
      this.create(createPlayerDTO);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ email });

    if (!playerFound) {
      throw new NotFoundException('Player Not Found');
    }
    return playerFound;
  }

  async removePlayerByEmail(email: string): Promise<DeleteResult> {
    const playerFound = await this.playerModel.findOne({ email });
    if (!playerFound) throw new NotFoundException('Player Not Found');

    return await this.playerModel.deleteOne({ email });
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDTO);

    return await createdPlayer.save();
  }

  private async update(
    playerFound: Player,
    createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playerModel.findOneAndUpdate(
      { email: playerFound.email },
      { $set: createPlayerDTO },
    );
  }
}
