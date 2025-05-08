import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native'; // Import Alert for feedback
import { createGroup } from '@/services/api/mockService'; // Adjust path if needed
import useCreateGroupStore from '@/stores/createGroupStore'; // Adjust import path
import type { CreateGroupState } from '@/stores/createGroupStore'; // Import type explicitly

/**
 * Custom hook to handle the creation of a new group.
 * Uses React Query's useMutation to manage the API call, state reset, navigation, 
 * and user feedback (alerts).
 *
 * @returns The mutation object from useMutation, which includes:
 *  - mutate: Function to trigger the group creation process (takes group data object, omitting resetState).
 *  - isPending: Boolean indicating if the group creation is in progress.
 *  - isError: Boolean indicating if an error occurred.
 *  - error: The error object if an error occurred.
 *  - and other useMutation return properties...
 */
const useCreateGroup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetFormState = useCreateGroupStore((state) => state.resetState);

  return useMutation<
    { success: boolean; groupId?: string }, // Success response type
    Error, // Error type
    Partial<Omit<CreateGroupState, 'resetState'>> // Variables type (input to mutationFn), omit functions
  >({
    mutationFn: (groupData) => createGroup(groupData),
    onSuccess: (data, variables) => {
      Alert.alert('Group Created!', `Mock Group Created Successfully!\nID: ${data.groupId}`); // Simple success feedback
      resetFormState(); // Reset the form state in Zustand store

      // Invalidate queries that might show group lists (if any exist)
      // Example: queryClient.invalidateQueries({ queryKey: ['groups'] });
      // Example: queryClient.invalidateQueries({ queryKey: ['exploreGroups'] });

      // Navigate back or to the new group
      // Option 1: Go back (assuming modal or pushed route)
      if (router.canGoBack()) {
          router.back();
      }
      // Option 2: Navigate to the new group page (adjust path as needed)
      // router.replace(`/groups/${data.groupId}`); 
    },
    onError: (error) => {
      console.error('Create Group Error:', error);
      Alert.alert('Creation Failed', `Failed to create group: ${error.message}`); // Simple error feedback
    },
    // Optional: onSettled can run after success or error
    // onSettled: () => {
    //   // Intentionally removed console.log for settled
    // }
  });
};

export default useCreateGroup; 