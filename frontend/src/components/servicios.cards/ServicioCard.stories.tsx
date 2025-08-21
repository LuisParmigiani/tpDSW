// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react';

import ServicioCard from './ServicioCard';

const meta = {
  title: 'Components/ServicioCard',
  component: ServicioCard,
} satisfies Meta<typeof ServicioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    nombre: 'Juan Perez',
    rubros: 'Electricidad',
    puntuacion: 4,
  },
};
