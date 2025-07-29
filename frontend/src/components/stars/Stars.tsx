type Props = {
  cant: number;
};

function Stars({ cant }: Props) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < cant) {
      stars.push(
        <img
          key={`full-${i}`}
          className="max-h-4 w-auto"
          src="../images/full-star.png"
          alt="estrella llena"
        />
      );
    } else {
      stars.push(
        <img
          key={`empty-${i}`}
          className="max-h-4 w-auto"
          src="../images/empty-star.png"
          alt="estrella vacía"
        />
      );
    }
  }
  return <div className="flex flex-row items-center max-h-10">{stars}</div>;
}

export default Stars;
