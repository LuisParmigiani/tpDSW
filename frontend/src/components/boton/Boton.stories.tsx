// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react';

import Boton from './boton.tsx';

const meta = {
  title: 'Components/Boton',
  component: Boton,
} satisfies Meta<typeof Boton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    texto: 'CONTACTAR',
    contactar: () => alert('Botón presionado'),
  },
};
