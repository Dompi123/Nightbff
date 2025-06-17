import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step2ImageScreen from '../step2-image'; // Import the screen component
import * as ImagePicker from 'expo-image-picker'; // Import to access mocked functions
import useCreateGroupStore from '@/stores/createGroupStore'; // Import the default export

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock expo-image-picker - Revised
jest.mock('expo-image-picker', () => ({
  __esModule: true, // Needed for ES modules
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' }, 
}));

// Mock the Zustand store
const mockSetGroupImageUri = jest.fn();
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    // Default minimal state for the mock
    groupImageUri: null,
    setGroupImageUri: mockSetGroupImageUri,
  })),
}));

describe('<Step2ImageScreen /> (Create Group Step 2)', () => {
  // Assign mocks after jest.mock has run
  const mockRequestPermissions = ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
  const mockLaunchImageLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;

  beforeEach(() => {
    // Clear mocks
    mockPush.mockClear();
    mockRequestPermissions.mockClear();
    mockLaunchImageLibrary.mockClear();
    mockSetGroupImageUri.mockClear();
    // Reset the mock store's return value to default (null image)
    (useCreateGroupStore as unknown as jest.Mock).mockReturnValue({
      groupImageUri: null,
      setGroupImageUri: mockSetGroupImageUri,
    });
  });

  it('renders initial placeholder and calls permission request on press', async () => {
    // Setup mock return values for this test
    mockRequestPermissions.mockResolvedValue({ status: 'granted' }); 
    mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });

    render(<Step2ImageScreen />);

    // Assert initial elements are present
    expect(screen.getByText('Upload an image of the destination')).toBeTruthy();
    expect(screen.getByText('Tap to upload')).toBeTruthy(); // Placeholder text
    expect(screen.getByText('Continue')).toBeTruthy();

    // Find the placeholder (TouchableOpacity wraps the placeholder content)
    // Targeting the text inside is a reasonable way to find the interactive element
    const placeholder = screen.getByText('Tap to upload');
    fireEvent.press(placeholder);

    // Assert permission request was called
    expect(mockRequestPermissions).toHaveBeenCalledTimes(1);

    // Wait for async actions to complete
    await screen.findByText('Tap to upload'); 
    
    // Assert library launch was called (since permissions granted)
    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);

    // Assert store wasn't updated (since cancelled)
    expect(mockSetGroupImageUri).not.toHaveBeenCalled();
  });

  it('renders selected image when groupImageUri is set', () => {
    const testUri = 'https://example.com/test.jpg';
    // Set the mock return value for this specific test
    (useCreateGroupStore as unknown as jest.Mock).mockReturnValue({
      groupImageUri: testUri,
      setGroupImageUri: mockSetGroupImageUri,
    });

    render(<Step2ImageScreen />);

    // Check the image is rendered (by checking its accessibility props or testID if added)
    // For now, we check that the placeholder text is GONE
    expect(screen.queryByText('Tap to upload')).toBeNull();

    // We expect the main text to still be there
    expect(screen.getByText('Upload an image of the destination')).toBeTruthy();

    // Check that the 'X' (clear) button is visible (assuming Ionicons name="close-circle")
    // We can query by the accessibility role/label if added, or test its container
    // For simplicity, let's assume presence if placeholder is gone.

    // TODO: Add more specific test for Image component rendering `testUri`
    // const image = screen.getByRole('image'); // Requires accessibilityRole="image" on Image
    // expect(image.props.source.uri).toBe(testUri);
  });

}); 