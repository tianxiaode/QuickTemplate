import {ILanguageInfo} from './LanguageInfo'
import {ICurrentCulture} from './CurrentCulture'


 export interface IApplicationLocalizationConfiguration {
	values: any ;
	resources: any ;
	languages: ILanguageInfo ;
	currentCulture: ICurrentCulture ;
	defaultResourceName: string ;
	languagesMap: any ;
	languageFilesMap: any ;
}
 

