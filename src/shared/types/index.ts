/** Common API */
export type { ApiResponse } from '@uniteam31/uni-shared-types';
import type { TMeta as Meta } from '@uniteam31/uni-shared-types';

export type TMeta = Meta & {
	spacesIds?: string[];
};
