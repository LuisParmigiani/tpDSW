import sharp from 'sharp';
import path from 'path';

export async function processProfileImage(
  inputPath: string,
  userId: number
): Promise<string> {
  const outputDir = path.join(__dirname, '../../public/uploads/profiles');
  const outputPath = path.join(outputDir, `profile_${userId}.jpg`);

  await sharp(inputPath)
    .resize(300, 300, {
      //cambia el tamaño de la imagen
      fit: 'cover',
      position: 'center', //si hay que recortar ,  lo hace desde el centro
    })
    .webp({ quality: 85 }) //cambia el formato a uno más eficiente
    .toFile(outputPath);
  return `/uploads/profiles/user-${userId}.webp`; // Devuelve la ruta relativa para almacenar en la base de datos
}
