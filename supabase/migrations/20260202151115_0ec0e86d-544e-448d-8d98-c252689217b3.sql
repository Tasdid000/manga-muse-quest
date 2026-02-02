-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id TEXT NOT NULL,
  manga_title TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, manga_id)
);

-- Enable RLS on bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id TEXT NOT NULL,
  manga_title TEXT NOT NULL,
  cover_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, manga_id)
);

-- Enable RLS on ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Ratings policies
CREATE POLICY "Users can view their own ratings"
  ON public.ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Create following table
CREATE TABLE public.following (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id TEXT NOT NULL,
  manga_title TEXT NOT NULL,
  cover_url TEXT,
  notify_updates BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, manga_id)
);

-- Enable RLS on following
ALTER TABLE public.following ENABLE ROW LEVEL SECURITY;

-- Following policies
CREATE POLICY "Users can view their own following"
  ON public.following FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own following"
  ON public.following FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own following"
  ON public.following FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own following"
  ON public.following FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();