import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value ?? "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  // ✅ Handle loading state
  if (loading || !movie) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-light-200 mt-4">Loading movie...</Text>
      </View>
    );
  }

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear = movie.release_date?.split("-")[0];
  const genres = movie.genres?.map((g) => g.name).join(" - ") || "N/A";
  const formattedBudget = `$${(movie.budget / 1_000_000).toFixed(1)} million`;
  const formattedRevenue = `$${(movie.revenue / 1_000_000).toFixed(1)} million`;
  const productionCompanies =
    movie.production_companies?.map((pc) => pc.name).join(" - ") || "N/A";

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Poster Image */}
        <View>
          <Image
            source={{ uri: posterUrl }}
            className="w-full h-[550px]"
            resizeMode="cover"
          />
        </View>

        {/* Movie Info Section */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* Title */}
          <Text className="text-white font-bold text-xl">{movie.title}</Text>

          {/* Year & Runtime */}
          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">{releaseYear}</Text>
            <Text className="text-light-200 text-sm">|</Text>
            <Text className="text-light-200 text-sm">{movie.runtime} min</Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="w-4 h-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie.vote_average)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie.vote_count} votes)
            </Text>
          </View>

          {/* General Info Blocks */}
          <MovieInfo label="Overview" value={movie.overview} />
          <MovieInfo label="Genres" value={genres} />

          {/* Budget + Revenue - as Row */}
          <View className="flex-row justify-between gap-x-6 mt-4">
            <MovieInfo label="Budget" value={formattedBudget} />
            <MovieInfo label="Revenue" value={formattedRevenue} />
          </View>

          {/* Production Companies - Full width in column */}
          <MovieInfo label="Production Companies" value={productionCompanies} />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
