import { SetMetadata } from '@nestjs/common';

export const PUBLIC_API_KEY = 'public';

export const PublicApi = () => SetMetadata(PUBLIC_API_KEY, true);
