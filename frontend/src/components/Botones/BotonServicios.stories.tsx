// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react';

import BotonServicios from './BotonServicios';

const meta = {
  title: 'Components/Boton',
  component: BotonServicios,
} satisfies Meta<typeof BotonServicios>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    texto: 'CONTACTAR',
    contactar: () => alert('Botón presionado'),
  },
};
