import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreatePostDto {
  @ApiProperty({ example: 'sample-post', description: 'Unique slug used in URLs' })
  slug!: string;

  @ApiProperty({ example: 'Welcome to NgPodium' })
  title!: string;

  @ApiProperty({ example: 'This is the body of the post' })
  body!: string;

  @ApiPropertyOptional({ example: '/images/abc123.png', description: 'Direct image URL (optional if imageData provided)' })
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'data:image/png;base64,iVBORw0KGgoAAA...'} )
  imageData?: string; // data URL e.g. data:image/png;base64,....

  @ApiPropertyOptional({ example: '2025-11-02T13:34:00Z', description: 'ISO date string' })
  date?: string;

  @ApiPropertyOptional({ type: [String], example: ['angular', 'blog'] })
  tags?: string[];
}
