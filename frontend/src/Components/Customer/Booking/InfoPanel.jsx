export default function InfoPanel({ distance, duration, cost }) {

    return (
            <div className="absolute top-4 w-40 right-4 bg-white p-4 rounded shadow-lg z-[1000]">
            {/* <h3 className="text-lg font-semibold">Route Information</h3> */}
            <h3 className=" text-md font-semibold"><strong>Distance:&nbsp;&nbsp;</strong> <span className="text-gray-700">{distance}</span> km</h3>
            <h3 className="text-md font-semibold"><strong>Time:&nbsp;&nbsp;</strong> <span className="text-gray-700">{duration}</span> Minutes</h3>
            <h3 className="text-md font-semibold"><strong>Cost:&nbsp;&nbsp;</strong><span className="text-gray-700"> &#8377; &nbsp;{cost}</span></h3>
          </div>


    )
}