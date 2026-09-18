import { DRONE } from '../../utils/constants';
import { Drone } from './Drone';
import { Cables } from './Cables';
import { LEDScreen } from './LEDScreen';

/**
 * Static composition of the full aerial advertising system:
 * drone body + four suspension cables + the LED display.
 *
 * Positioned so the whole formation is vertically centred around the origin,
 * which keeps the camera framing simple.
 */
export function DroneFormation() {
  return (
    <group position={[0, DRONE.assemblyOffsetY, 0]}>
      <Drone />
      <Cables />
      <LEDScreen />
    </group>
  );
}