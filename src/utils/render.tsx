// external imports
import { StarIcon } from "@heroicons/react/24/solid";

export const renderStars = (rate: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-primary"
        />
      );
    } else if (i === Math.ceil(rate) && !Number.isInteger(rate)) {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-primary"
        />
      );
    } else {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-white"
        />
      );
    }
  }
  return stars;
};
