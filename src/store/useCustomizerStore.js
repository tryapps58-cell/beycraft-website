import { create } from 'zustand'

export const useCustomizerStore = create((set, get) => ({
  selectedParts: {
    attack_ring: null,
    weight_disk: null,
    spin_gear:   null,
    face_bolt:   null,
  },
  selectPart: (partType, part) => set(state => ({
    selectedParts: { ...state.selectedParts, [partType]: part }
  })),
  loadBuild: (parts) => set({ selectedParts: parts }),
  resetToDefaults: () => set({
    selectedParts: { attack_ring: null, weight_disk: null, spin_gear: null,
                     face_bolt: null }
  }),
}))
