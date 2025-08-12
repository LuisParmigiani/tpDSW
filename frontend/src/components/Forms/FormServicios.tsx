'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './../Botones/FormButton.js';
import { Form, FormControl, FormField, FormItem, FormMessage } from './Form.js';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './../Select/Select.js';

// Define the form schema
const formSchema = z.object({
  servicio: z.string().min(1, {
    message: 'Por favor selecciona un servicio.',
  }),
  zona: z.string().min(1, {
    message: 'Por favor selecciona una zona.',
  }),
  ordenarPor: z.string().min(1, {
    message: 'Por favor selecciona una opción de orden.',
  }),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define props for the component
type ServiciosFormProps = {
  tipoServicios: Array<{ nombreTipo: string; descripcionTipo: string }>;
  zonas: Array<{ id: number; descripcionZona: string }>;
  onSubmit: (values: FormValues) => void;
};

export function ServiciosForm({
  tipoServicios,
  zonas,
  onSubmit,
}: ServiciosFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      servicio: '',
      zona: '',
      ordenarPor: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="hover:scale-105 transition mt-4 ease-in-out duration-75 bg-tinte-5 mx-auto my-2 flex gap-2 py-1 shadow-2xl flex-col max-w-4/5 justify-items-center justify-center items-center rounded-md lg:rounded-full lg:flex-row lg:align-middle"
      >
        <div className="mb-4">
          <Button
            type="reset"
            className={
              'border-1 border-gray-800 bg-gray-500 text-white text-center py-1 px-4 rounder-md  ' +
              'hover:bg-gray-300 hover:text-gray-800 transition duration-300 cursor-pointer'
            }
            onClick={() => form.reset()}
          >
            Reestablecer
          </Button>
        </div>
        <FormField
          control={form.control}
          name="servicio"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoServicios?.map((tipo, index) => (
                      <SelectItem
                        key={index}
                        value={tipo.nombreTipo}
                        className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                      >
                        {tipo.nombreTipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zona Field */}
        <FormField
          control={form.control}
          name="zona"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonas?.map((zona, index) => (
                      <SelectItem
                        key={index}
                        value={zona.descripcionZona}
                        className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                      >
                        {zona.descripcionZona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ordenar Por Field */}
        <FormField
          control={form.control}
          name="ordenarPor"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="calificacion"
                      className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                    >
                      Calificación
                    </SelectItem>
                    <SelectItem
                      value="nombre"
                      className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                    >
                      Nombre
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-4">
          <Button
            type="submit"
            className={
              'bg-naranja-1 border-2 border-naranja-1 text-white text-center py-1 px-4 rounded-md hover:bg-white ' +
              'hover:border-naranja-1 hover:border-2 hover:text-naranja-1 hover:text-primary transition-duration-300 ' +
              'box-border cursor-pointer'
            }
          >
            Buscar
          </Button>
        </div>
      </form>
    </Form>
  );
}
