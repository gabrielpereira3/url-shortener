import {IsNotEmpty, IsUrl} from 'class-validator';

export class UpdateLongUrlDto {
  @IsUrl()
  @IsNotEmpty()
  newLongUrl: string;
}
