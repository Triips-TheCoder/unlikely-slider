/**
 * Detect if browsers support WebP
 * @return { Promise }
 */
export const detectWebP = async () =>
{
	// If the browser doesn't has the method createImageBitmap, you can't display webp format
	if (!self.createImageBitmap) return false;

	// Base64 representation of a white point image
	const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

	// Retrieve the Image in Blob Format
	const blob = await fetch(webpData).then(r => r.blob());

	// If the createImageBitmap method succeeds, return true, otherwise false
	return createImageBitmap(blob).then(() => true, () => false);
}