import Logo from "@/Components/Logo";

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 flex flex-col justify-between items-center bg-white z-50">
            <div className="flex-1 flex flex-col justify-center items-center w-full">
                {/*  <div className="rounded-full h-16 w-16 mb-4 p-1 flex items-center justify-center">
                    <ACLogo className="w-full h-full" />
                </div>
                 */}
                <Logo width={80} height={80} className="mx-auto sm:mx-0" />

                <span className="text-lg font-bold text-gray-700 text-center">

                    <h2 className="font-bold text-primary text-2xl md:text-4xl lg:text-5xl xl:text-6xl">BACOOR</h2>
                    <span className="uppercase font-semibold text-balance text-sm">Disaster Risk Reduction & Management Office</span>
                </span>
            </div>
            {/* <div className="mb-8 flex gap-5 flex-col items-center text-center">
                <Logo width={80} height={80} className="mx-auto sm:mx-0" />
                <span className="uppercase font-semibold text-balance text-sm">Disaster Risk Reduction & Management Office</span> 
            </div> **/}
        </div>
    );
}