import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
