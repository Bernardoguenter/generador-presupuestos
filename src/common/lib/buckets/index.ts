import { supabase } from "../../../utils/supabase";

const uploadFileToBucket = async (
  file: File,
  bucket: string,
  folder: string = "/",
  name: string
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${folder}${name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return { data, error };
};

const deleteFileInBucket = async (bucket: string, fileName: string) => {
  const fileToRemove = fileName.startsWith(`${bucket}/`)
    ? fileName.slice(bucket.length + 1)
    : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([fileToRemove]);

  return { data, error };
};

const replaceFileInBucket = async (
  file: File,
  bucket: string,
  folder: string = "/",
  name: string
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .update(`${folder}${name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  return { data, error };
};

const retriveFileFromBucket = async (bucket: string, fileName: string) => {
  const fileToRetrieve = fileName.startsWith(`${bucket}/`)
    ? fileName.slice(bucket.length + 1)
    : fileName;
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileToRetrieve);

  return { data };
};

export {
  uploadFileToBucket,
  deleteFileInBucket,
  replaceFileInBucket,
  retriveFileFromBucket,
};
