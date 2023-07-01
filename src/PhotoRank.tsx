import React, { useState, useEffect, useCallback } from "react";

import "./PhotoRank.css";

interface Photo {
  id: number;
  rating: number;
  score: number;
  url: string;
}

const intitalPhotos: Photo[] = [
  { id: 1, url: "001.jpg", rating: 1000, score: 0 },
  { id: 2, url: "002.jpg", rating: 1000, score: 0 },
  { id: 3, url: "003.jpg", rating: 1000, score: 0 },
  { id: 4, url: "004.jpg", rating: 1000, score: 0 },
  { id: 5, url: "005.jpg", rating: 1000, score: 0 },
  { id: 6, url: "006.jpg", rating: 1000, score: 0 },
  { id: 7, url: "007.jpg", rating: 1000, score: 0 },
  { id: 8, url: "008.jpg", rating: 1000, score: 0 },
  { id: 9, url: "009.jpg", rating: 1000, score: 0 },
  { id: 10, url: "010.jpg", rating: 1000, score: 0 },
  // Add more photos as needed
];

const PhotoRankingApp: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(intitalPhotos);
  const [photoIndex1, setPhotoIndex1] = useState<number>(0);
  const [photoIndex2, setPhotoIndex2] = useState<number>(1);
  const [stabilized, setStabilized] = useState<boolean>(false);
  const [iteration, setIteration] = useState(0);

  const handlePhotoSelection = (selectedPhotoIndex: number) => {
    const updatedPhotos = [...photos];
    const photo1 = updatedPhotos[photoIndex1];
    const photo2 = updatedPhotos[photoIndex2];

    const expectedScore1 =
      1 / (1 + 10 ** ((photo2.rating - photo1.rating) / 400));
    const expectedScore2 = 1 - expectedScore1;

    const kFactor = 32; // Adjust this value to control the rate of rating change

    const score1 = selectedPhotoIndex === 0 ? 1 : 0;
    const score2 = selectedPhotoIndex === 1 ? 1 : 0;

    const newRating1 = photo1.rating + kFactor * (score1 - expectedScore1);
    const newRating2 = photo2.rating + kFactor * (score2 - expectedScore2);

    photo1.rating = newRating1;
    photo2.rating = newRating2;

    setIteration(iteration + 1);
    setPhotos(updatedPhotos);
    setNextPhotoIndices();
  };

  const setNextPhotoIndices = () => {
    const numPhotos = photos.length;

    if (numPhotos <= 2) {
      setStabilized(true);
    } else {
      const newPhotoIndex1 = Math.floor(Math.random() * numPhotos);

      let newPhotoIndex2;
      do {
        newPhotoIndex2 = Math.floor(Math.random() * numPhotos);
      } while (newPhotoIndex2 === newPhotoIndex1);

      setPhotoIndex1(newPhotoIndex1);
      setPhotoIndex2(newPhotoIndex2);
    }
  };

  useEffect(() => {
    // Check if ranks have stabilized
    const checkStabilization = (): void => {
      const tolerance = 0.01; // Adjust this as needed
      const numIterations = 5; // Adjust this as needed

      if (iteration < numIterations) {
        return;
      }

      const prevIterations = photos.slice(iteration - numIterations, iteration);
      const averageChange =
        prevIterations.reduce(
          (sum, iterationPhoto) => sum + iterationPhoto.rating,
          0
        ) / numIterations;

      console.log(averageChange);
      if (averageChange < tolerance) {
        setStabilized(true);
      }
    };

    checkStabilization();
  }, [iteration, photos]);

  // create call back function to handle keydown event

  useEffect(() => {
    console.log("useEffect");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePhotoSelection(0);

        console.log("arror left");
      } else if (event.key === "ArrowRight") {
        handlePhotoSelection(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePhotoSelection]);

  return (
    <div>
      <div className="grid-container">
        <div>
          <div className="image-container">
            <img src={`photos/${photos[photoIndex1].url}`} alt="Photo 1" />
          </div>

          <h2> {photos[photoIndex1].id}</h2>
          <button onClick={() => handlePhotoSelection(0)}>Choose</button>
        </div>
        <div>
          <div className="image-container">
            <img src={`photos/${photos[photoIndex2].url}`} alt="Photo 2" />
          </div>
          <h2> {photos[photoIndex2].id}</h2>
          <button onClick={() => handlePhotoSelection(1)}>Choose</button>
        </div>
      </div>
      <div>
        <h2 className="title">Rankings</h2>
        <PhotoGrid photos={photos.sort((a, b) => b.rating - a.rating)} />
      </div>
    </div>
  );
};

function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div className="photo" key={photo.id}>
          <img src={`photos/${photo.url}`} alt={`Photo ${photo.id}`} />
          <p>ID: {photo.id}</p>
          <p>Ranking: {photo.rating.toFixed(0)}</p>
        </div>
      ))}
    </div>
  );
}

export default PhotoRankingApp;
