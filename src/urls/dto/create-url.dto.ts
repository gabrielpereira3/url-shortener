import {IsNotEmpty, IsUrl} from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({message: 'The longUrl field is required.'})
  @IsUrl({}, {message: 'The longUrl must be a valid URL.'})
  longUrl: string;
}
