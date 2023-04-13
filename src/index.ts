import Rhino3dm, { ArcCurve } from 'rhino3dm';
// @ts-ignore Could not find a declaration file for module 'compute-rhino3d'.
import RhinoCompute from 'compute-rhino3d';

console.log('Hello Rhino3dm!');
RhinoCompute.url = 'http://localhost:8081/';

async function main() {
  const rhino = await Rhino3dm();

  // Create a world xy plane
  const plane = {
    "Origin": { "X": 0.0, "Y": 0.0, "Z": 0.0 },
    "XAxis": { "X": 1.0, "Y": 0.0, "Z": 0.0 },
    "YAxis": { "X": 0.0, "Y": 1.0, "Z": 0.0 },
    "ZAxis": { "X": 0.0, "Y": 0.0, "Z": 1.0 },
    "Normal": { "X": 0.0, "Y": 0.0, "Z": 1.0 }
  }

  // Create a sphere at the origin and convert to brep
  const brep = new rhino.Sphere([0,0,0], 5).toBrep()

  // Call compute to intersect the sphere with the xy plane
  let result: any
  try {
    result = await RhinoCompute.Intersection.brepPlane(brep, plane, 0.001)
  } catch(err) {
    console.error(err)
  }
  const [success, intersection] = result

  if (!success) {
    console.error('Failed to intersect')
    return
  }

  // @ts-ignore
  const decoded = rhino.CommonObject.decode(intersection[0]) as ArcCurve

  console.log(decoded)
  console.log(decoded.radius)
}

main();