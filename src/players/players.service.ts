import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerFound = await this.playerModel.findOne({ email });

    if (playerFound) throw new BadRequestException('E-mail already taken');

    const createdPlayer = new this.playerModel(createPlayerDTO);

    return await createdPlayer.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    const playerFound = await this.playerModel.findOne({ _id });

    if (!playerFound) throw new NotFoundException('Player not found');

    await this.playerModel.findOneAndUpdate({ _id }, { $set: updatePlayerDTO });
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findPlayerBy(filter: any) {
    const playerFound = await this.playerModel.findOne(filter);

    if (!playerFound) {
      throw new NotFoundException('Player Not Found');
    }
    return playerFound;
  }

  async removePlayerById(_id: string): Promise<DeleteResult> {
    const playerFound = await this.playerModel.findOne({ _id });
    if (!playerFound) throw new NotFoundException('Player Not Found');

    return await this.playerModel.deleteOne({ _id });
  }
}
