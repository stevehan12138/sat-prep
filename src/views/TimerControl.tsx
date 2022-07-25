import { 
	Box,
	Button
} from '@chakra-ui/react';
import { useEffect } from 'react';

export default function TimerControl(props: any) {

	useEffect(() => {
		document.addEventListener('keydown', logKeyDown, false);
		function logKeyDown(e: KeyboardEvent) {
			if(e.key === ' ') {
				e.preventDefault();
				props.handleNext();
				document.removeEventListener("keydown", logKeyDown, false);
				document.addEventListener('keyup', logKeyUp, false);
			}
		}

		function logKeyUp(e: KeyboardEvent) {
			if(e.key === ' ') {
				e.preventDefault();
				document.removeEventListener("keyup", logKeyUp, false);
				document.addEventListener('keydown', logKeyDown, false);
			}
		}

		return () => {
			document.removeEventListener('keydown', logKeyDown, false);
			document.removeEventListener('keyup', logKeyUp, false);
		};
	}, []);

	return (
		<Box w='400px' m='0 auto'>
			<Button colorScheme='teal' size='lg' mt='10px' w='48%' onClick={props.pause}>
				Pause
			</Button>
			<Button colorScheme='teal' size='lg' mt='10px' w='48%' float='right' onClick={props.resume}>
				Resume
			</Button>
			<Button colorScheme='teal' size='lg' mt='10px' w='100%' onClick={props.handleNext}>
				Next Question (Space Key)
			</Button>
		</Box>
	);
}
 