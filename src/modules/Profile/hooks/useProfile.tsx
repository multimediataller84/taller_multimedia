import { useEffect, useState } from "react";
import { TUserEndpoint } from "../models/types/TUserEndpoint";
import { TUser } from "../models/types/TUser";
import { UseCasesController } from "../controllers/useCasesController";
import { ProfileRepository } from "../repositories/profileRepository";

const repository = ProfileRepository.getInstance();
const useCases = new UseCasesController(repository);

export const useProfile = () => {
  const [profiles, setProfiles] = useState<TUserEndpoint[]>([]);
  const [profileSelect, setProfileSelect] = useState<any>(null);

  const [editProfile, setEditProfile] = useState(false);
  const [visibleEditProfile, setVisibleEditProfile] = useState(false);

  const [addProfile, setAddProfile] = useState(false);
  const [visibleAddProfile, setVisibleAddProfile] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const profilesPerPage = 10;
  const indexOfLastProfile = activePage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await useCases.getAll.execute();
        setProfiles(data);
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      }
    };
    fetchClients();
  }, []);

  const handleAddProfile = async (newUser: TUser) => {
    try {
      await useCases.post.execute(newUser);

      const data = await useCases.getAll.execute();
      setProfiles(data);

      setVisibleAddProfile(false);
      setProfileSelect(null);
    } catch (error) {
      console.error("Error al crear perfil:", error);
    }
  };

  const handleSave = async () => {
    if (!profileSelect) return;
    try {
      const updated = await useCases.patch.execute(
        profileSelect.id,
        profileSelect
      );
      setProfiles((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setEditProfile(false);

      if (editProfile) {
        setVisibleAddProfile(false);
        setVisibleEditProfile(false);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProfileSelect((prev: TUserEndpoint) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim() === "") {
      setEditProfile(false);
      setAddProfile(false);
    } else {
      setEditProfile(true);
      setAddProfile(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await useCases.delete.execute(id);
      setProfiles((prev) => prev.filter((c) => c.id !== id));
      setEditProfile(false);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  return {
    handleAddProfile,
    handleChange,
    handleDelete,
    handleSave,
    visibleAddProfile,
    setVisibleAddProfile,
    setVisibleEditProfile,
    setProfileSelect,
    currentProfiles,
    profileSelect,
    activePage,
    profiles,
    setActivePage,
    addProfile,
    editProfile,
    visibleEditProfile,
  };
};
