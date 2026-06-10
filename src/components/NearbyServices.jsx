import {
  Wrench,
  Battery,
  Gauge,
  Truck,
  ArrowRight,
  MapPin,
  Star,
  Clock3,
  Phone,
} from "lucide-react";

const NearbyServices = () => {
  const services = [
    {
      title: "Repair",
      desc: "Instant tractor repair service",
      icon: Wrench,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Battery",
      desc: "Electrical & battery fixing",
      icon: Battery,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Inspection",
      desc: "Complete tractor inspection",
      icon: Gauge,
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Towing",
      desc: "Emergency towing support",
      icon: Truck,
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
  ];

  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className=" px-4 sm:px-6 lg:px-20">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-14">

          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm mb-5">
              <Star className="h-4 w-4 fill-white" />
              Trusted by 15,000+ farmers
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight text-black">
              Tractor service
              <span className="block bg-clip-text text-transparent bg-green-600">
                at your doorstep.
              </span>
            </h1>

            <p className="text-gray-600 text-lg mt-6 leading-relaxed max-w-xl">
              Book nearby tractor mechanics for repair,
              servicing, towing and inspection in minutes.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-green-600 hover:from-green-700 hover:to-green-700 cursor-pointer text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg">
                Book Service
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="bg-white cursor-pointer px-8 py-4 rounded-xl font-bold border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Emergency Call
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl p-6 w-full lg:w-[380px] shadow-sm border border-gray-100">

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-black text-xl text-black">Meerut, UP</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                "Mechanic arrives in 30 mins",
                "24/7 emergency support",
                "Verified service partners",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  <p className="font-medium text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <button className="w-full cursor-pointer mt-7 bg-green-600 hover:from-green-700 hover:to-green-700 text-white py-4 rounded-xl font-black transition-all duration-300">
              Change Location
            </button>
          </div>
        </div>

        {/* SERVICES */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer border border-gray-400"
            >
              {/* ICON */}
              <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className={`h-8 w-8 ${service.iconColor}`} />
              </div>

              {/* TEXT */}
              <h3 className="text-2xl font-black text-black mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                {service.desc}
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-500">Available now</span>
                </div>

                <button className="w-10 h-10 cursor-pointer rounded-full bg-green-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NearbyServices;