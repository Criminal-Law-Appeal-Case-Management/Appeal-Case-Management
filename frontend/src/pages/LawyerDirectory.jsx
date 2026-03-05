import { Scale, ArrowLeft, ExternalLink, MapPin, Phone, Globe, Users, Building2, Gavel } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

const lawyerResources = [
  {
    state: "New South Wales",
    code: "NSW",
    color: "bg-blue-600",
    legalAid: {
      name: "Legal Aid NSW",
      url: "https://www.legalaid.nsw.gov.au/",
      phone: "1300 888 529",
      description: "Free legal help for eligible people, including criminal appeals"
    },
    barAssociation: {
      name: "NSW Bar Association",
      url: "https://nswbar.asn.au/",
      description: "Find a barrister specializing in criminal appeals"
    },
    lawSociety: {
      name: "Law Society of NSW",
      url: "https://www.lawsociety.com.au/",
      description: "Find a solicitor - use 'Criminal Law' filter"
    },
    specialists: [
      { name: "Criminal Defence Lawyers Australia", url: "https://criminaldefencelawyers.com.au/" },
      { name: "Sydney Criminal Lawyers", url: "https://www.sydneycriminallawyers.com.au/" }
    ]
  },
  {
    state: "Victoria",
    code: "VIC",
    color: "bg-purple-600",
    legalAid: {
      name: "Victoria Legal Aid",
      url: "https://www.legalaid.vic.gov.au/",
      phone: "1300 792 387",
      description: "Free legal help for eligible Victorians"
    },
    barAssociation: {
      name: "Victorian Bar",
      url: "https://www.vicbar.com.au/",
      description: "Find a barrister - search criminal law specialists"
    },
    lawSociety: {
      name: "Law Institute of Victoria",
      url: "https://www.liv.asn.au/",
      description: "Find a solicitor in your area"
    },
    specialists: [
      { name: "Stary Norton Halphen", url: "https://www.starynortonhalphen.com.au/" },
      { name: "Doogue + George", url: "https://www.doogugeorge.com.au/" }
    ]
  },
  {
    state: "Queensland",
    code: "QLD",
    color: "bg-red-600",
    legalAid: {
      name: "Legal Aid Queensland",
      url: "https://www.legalaid.qld.gov.au/",
      phone: "1300 651 188",
      description: "Free legal services for eligible Queenslanders"
    },
    barAssociation: {
      name: "Bar Association of Queensland",
      url: "https://www.qldbar.asn.au/",
      description: "Find a barrister in Queensland"
    },
    lawSociety: {
      name: "Queensland Law Society",
      url: "https://www.qls.com.au/",
      description: "Find a solicitor - use referral service"
    },
    specialists: [
      { name: "Potts Lawyers", url: "https://www.pottslawyers.com.au/" },
      { name: "Robertson O'Gorman", url: "https://www.robertsonogorman.com.au/" }
    ]
  },
  {
    state: "South Australia",
    code: "SA",
    color: "bg-amber-600",
    legalAid: {
      name: "Legal Services Commission SA",
      url: "https://lsc.sa.gov.au/",
      phone: "1300 366 424",
      description: "Legal Aid services in South Australia"
    },
    barAssociation: {
      name: "South Australian Bar Association",
      url: "https://www.sabar.org.au/",
      description: "Find a barrister in SA"
    },
    lawSociety: {
      name: "Law Society of South Australia",
      url: "https://www.lawsocietysa.asn.au/",
      description: "Find a solicitor"
    },
    specialists: []
  },
  {
    state: "Western Australia",
    code: "WA",
    color: "bg-emerald-600",
    legalAid: {
      name: "Legal Aid WA",
      url: "https://www.legalaid.wa.gov.au/",
      phone: "1300 650 579",
      description: "Free legal help for Western Australians"
    },
    barAssociation: {
      name: "WA Bar Association",
      url: "https://www.wabar.asn.au/",
      description: "Find a barrister in WA"
    },
    lawSociety: {
      name: "Law Society of Western Australia",
      url: "https://www.lawsocietywa.asn.au/",
      description: "Find a solicitor"
    },
    specialists: [
      { name: "Pattison Hardman", url: "https://www.pattisonhardman.com.au/" }
    ]
  },
  {
    state: "Tasmania",
    code: "TAS",
    color: "bg-teal-600",
    legalAid: {
      name: "Legal Aid Commission of Tasmania",
      url: "https://www.legalaid.tas.gov.au/",
      phone: "1300 366 611",
      description: "Legal Aid services in Tasmania"
    },
    barAssociation: {
      name: "Tasmanian Bar",
      url: "https://www.tasbar.com.au/",
      description: "Find a barrister in Tasmania"
    },
    lawSociety: {
      name: "Law Society of Tasmania",
      url: "https://www.lst.org.au/",
      description: "Find a solicitor"
    },
    specialists: []
  },
  {
    state: "Northern Territory",
    code: "NT",
    color: "bg-orange-600",
    legalAid: {
      name: "Northern Territory Legal Aid Commission",
      url: "https://www.ntlac.nt.gov.au/",
      phone: "1800 019 343",
      description: "Free legal help in the NT"
    },
    barAssociation: {
      name: "Northern Territory Bar Association",
      url: "https://ntbar.asn.au/",
      description: "Find a barrister in NT"
    },
    lawSociety: {
      name: "Law Society Northern Territory",
      url: "https://lawsocietynt.asn.au/",
      description: "Find a solicitor"
    },
    specialists: []
  },
  {
    state: "Australian Capital Territory",
    code: "ACT",
    color: "bg-indigo-600",
    legalAid: {
      name: "Legal Aid ACT",
      url: "https://www.legalaidact.org.au/",
      phone: "1300 654 314",
      description: "Legal Aid services in the ACT"
    },
    barAssociation: {
      name: "ACT Bar Association",
      url: "https://www.actbar.com.au/",
      description: "Find a barrister in ACT"
    },
    lawSociety: {
      name: "Law Society of the ACT",
      url: "https://www.actlawsociety.asn.au/",
      description: "Find a solicitor"
    },
    specialists: []
  }
];

const nationalResources = [
  {
    name: "National Association of Community Legal Centres",
    url: "https://www.naclc.org.au/",
    description: "Find free community legal centres across Australia"
  },
  {
    name: "Law Council of Australia",
    url: "https://www.lawcouncil.asn.au/",
    description: "Peak body for the legal profession"
  },
  {
    name: "Australian Pro Bono Centre",
    url: "https://www.probonocentre.org.au/",
    description: "Information about pro bono legal services"
  },
  {
    name: "Justice Connect",
    url: "https://justiceconnect.org.au/",
    description: "Connecting people with free legal help"
  }
];

const LawyerDirectory = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-500" />
            <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 px-6 py-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Find a Criminal Appeal Lawyer
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Connect with qualified criminal law specialists, Legal Aid services, and pro bono resources across Australia.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Important Notice */}
        <Card className="mb-8 bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Gavel className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Important</h3>
                <p className="text-amber-800 text-sm">
                  This directory provides links to legal resources for informational purposes only. 
                  We do not endorse any specific lawyer or firm. Always conduct your own research and 
                  meet with potential lawyers before engaging their services. Many offer free initial consultations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* National Resources */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            <Globe className="w-5 h-5 text-blue-600" />
            National Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {nationalResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow hover:border-blue-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{resource.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{resource.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* State Resources */}
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
          <MapPin className="w-5 h-5 text-emerald-600" />
          Resources by State
        </h2>
        
        <div className="space-y-6">
          {lawyerResources.map((state, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className={`${state.color} text-white py-3`}>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/20 border-white/40 text-white">
                    {state.code}
                  </Badge>
                  {state.state}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Legal Aid */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Legal Aid
                    </h4>
                    <a
                      href={state.legalAid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      {state.legalAid.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-slate-500 mt-1">{state.legalAid.description}</p>
                    {state.legalAid.phone && (
                      <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {state.legalAid.phone}
                      </p>
                    )}
                  </div>

                  {/* Bar Association */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-purple-600" />
                      Find a Barrister
                    </h4>
                    <a
                      href={state.barAssociation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      {state.barAssociation.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-slate-500 mt-1">{state.barAssociation.description}</p>
                  </div>

                  {/* Law Society */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Find a Solicitor
                    </h4>
                    <a
                      href={state.lawSociety.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      {state.lawSociety.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-slate-500 mt-1">{state.lawSociety.description}</p>
                  </div>
                </div>

                {/* Specialists */}
                {state.specialists.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Criminal Law Specialists
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {state.specialists.map((specialist, idx) => (
                        <a
                          key={idx}
                          href={specialist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                        >
                          {specialist.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Prepare Before You Meet a Lawyer
            </h3>
            <p className="text-slate-400 mb-4">
              Use our tool to organize your case documents and identify potential grounds for appeal. 
              Having organized information can save time and money when meeting with a lawyer.
            </p>
            <Link to="/">
              <Button className="bg-amber-600 text-white hover:bg-amber-700">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyerDirectory;
