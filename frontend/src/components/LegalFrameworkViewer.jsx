import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Scale, BookOpen, Shield, AlertTriangle, ChevronDown, ChevronRight,
  FileText, Gavel, ExternalLink, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { API } from "../App";

const LegalFrameworkViewer = ({ offenceCategory, offenceType }) => {
  const [framework, setFramework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    nsw: true,
    federal: false,
    defences: false,
    elements: false,
    appeals: false
  });

  useEffect(() => {
    if (offenceCategory) {
      fetchFramework();
    }
  }, [offenceCategory]);

  const fetchFramework = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/offence-framework/${offenceCategory}`);
      setFramework(response.data);
    } catch (error) {
      console.error("Failed to load legal framework:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
          <p className="mt-3 text-slate-600">Loading legal framework...</p>
        </CardContent>
      </Card>
    );
  }

  if (!framework) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-8 text-center">
          <Scale className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="mt-3 text-slate-600">No legal framework available</p>
        </CardContent>
      </Card>
    );
  }

  const category = framework.category;
  const commonGrounds = framework.common_appeal_grounds || [];

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <CardTitle 
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                Legal Framework
              </CardTitle>
              <p className="text-sm text-slate-600 mt-0.5">
                {category?.name} - {offenceType || 'General'}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            NSW & Federal Law
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* NSW Legislation */}
        {category?.nsw_legislation && Object.keys(category.nsw_legislation).length > 0 && (
          <Collapsible open={expandedSections.nsw} onOpenChange={() => toggleSection('nsw')}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-blue-50 hover:bg-blue-100 rounded-lg"
                data-testid="nsw-legislation-toggle"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">NSW Legislation</span>
                  <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                    {Object.values(category.nsw_legislation).flat().length} sections
                  </Badge>
                </div>
                {expandedSections.nsw ? (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-3 pl-2">
                {Object.entries(category.nsw_legislation).map(([actName, sections]) => (
                  <div key={actName} className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      {actName}
                    </h4>
                    <div className="space-y-2">
                      {sections.map((section, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0"
                        >
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-mono shrink-0">
                            {section.section}
                          </Badge>
                          <span className="text-slate-700 text-sm">{section.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Federal Legislation */}
        {category?.cth_legislation && Object.keys(category.cth_legislation).length > 0 && (
          <Collapsible open={expandedSections.federal} onOpenChange={() => toggleSection('federal')}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-purple-50 hover:bg-purple-100 rounded-lg"
                data-testid="federal-legislation-toggle"
              >
                <div className="flex items-center gap-3">
                  <Gavel className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Commonwealth Legislation</span>
                  <Badge variant="outline" className="bg-white text-purple-700 border-purple-200">
                    {Object.values(category.cth_legislation).flat().length} sections
                  </Badge>
                </div>
                {expandedSections.federal ? (
                  <ChevronDown className="w-5 h-5 text-purple-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-purple-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-3 pl-2">
                {Object.entries(category.cth_legislation).map(([actName, sections]) => (
                  <div key={actName} className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      {actName}
                    </h4>
                    <div className="space-y-2">
                      {sections.map((section, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0"
                        >
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-mono shrink-0">
                            {section.section}
                          </Badge>
                          <span className="text-slate-700 text-sm">{section.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Key Elements */}
        {category?.key_elements && category.key_elements.length > 0 && (
          <Collapsible open={expandedSections.elements} onOpenChange={() => toggleSection('elements')}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-amber-50 hover:bg-amber-100 rounded-lg"
                data-testid="key-elements-toggle"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Key Elements to Prove</span>
                  <Badge variant="outline" className="bg-white text-amber-700 border-amber-200">
                    {category.key_elements.length} elements
                  </Badge>
                </div>
                {expandedSections.elements ? (
                  <ChevronDown className="w-5 h-5 text-amber-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-amber-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-3">
                  The prosecution must prove each of these elements beyond reasonable doubt:
                </p>
                <ul className="space-y-2">
                  {category.key_elements.map((element, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700">{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Available Defences */}
        {category?.defences && category.defences.length > 0 && (
          <Collapsible open={expandedSections.defences} onOpenChange={() => toggleSection('defences')}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                data-testid="defences-toggle"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Available Defences</span>
                  <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200">
                    {category.defences.length} defences
                  </Badge>
                </div>
                {expandedSections.defences ? (
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-emerald-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-3">
                  Potential defences that may apply to {category.name?.toLowerCase()} offences:
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.defences.map((defence, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3"
                    >
                      {defence}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Common Appeal Grounds */}
        {commonGrounds.length > 0 && (
          <Collapsible open={expandedSections.appeals} onOpenChange={() => toggleSection('appeals')}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-slate-100 hover:bg-slate-200 rounded-lg"
                data-testid="appeal-grounds-toggle"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">Common Appeal Grounds</span>
                  <Badge variant="outline" className="bg-white text-slate-700 border-slate-200">
                    {commonGrounds.length} grounds
                  </Badge>
                </div>
                {expandedSections.appeals ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {commonGrounds.slice(0, 12).map((ground, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-200 rounded-lg p-3"
                  >
                    <h5 className="font-medium text-slate-900 mb-1">{ground.ground}</h5>
                    <p className="text-sm text-slate-600">{ground.description}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* AustLII Link */}
        <div className="pt-4 border-t border-slate-200">
          <a 
            href="https://www.austlii.edu.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View full legislation on AustLII
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalFrameworkViewer;
